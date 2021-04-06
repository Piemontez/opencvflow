#ifndef OPCVF_IMGPROC_H
#define OPCVF_IMGPROC_H

#include "items.h"
#include "component.h"

/**
 * @brief The SobelNode class
 */
class SobelNode: public ocvflow::NodeItem {
    int ddepth{CV_8U};
    int dx{1};
    int dy{0};
    int ksize{3};
    double scale{1};
    double delta{0};
public:
    SobelNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};

class SobelComponent: public ocvflow::ProcessorComponent {
public:
    SobelComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The CannyNode class
 */
class CannyNode: public ocvflow::NodeItem {
    double threshold1{80};
    double threshold2{170};
    int aperturesize{3};
    bool L2gradiente{0};
public:
    CannyNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class CannyComponent: public ocvflow::ProcessorComponent {
public:
    CannyComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The LaplacianNode class
 */
class LaplacianNode: public ocvflow::NodeItem {
    int ddepth{CV_8U};
    int ksize{3};
    double scale{1};
    double delta{0};
public:
    LaplacianNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class LaplacianComponent: public ocvflow::ProcessorComponent {
public:
    LaplacianComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The MedianBlurNode class
 */
class MedianBlurNode: public ocvflow::NodeItem {
    int ksize{3};
public:
    MedianBlurNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class MedianBlurComponent: public ocvflow::ProcessorComponent {
public:
    MedianBlurComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The GaussianBlurNode class
 */
class GaussianBlurNode: public ocvflow::NodeItem {
    cv::Size size{3,3};
    double sigmaX{1};
    double sigmaY{0};

public:
    GaussianBlurNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class GaussianBlurComponent: public ocvflow::ProcessorComponent {
public:
    GaussianBlurComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The BilateralFilterNode class
 */
class BilateralFilterNode: public ocvflow::NodeItem {
    int d{1};
    double sigmaColor{1};
    double sigmaSpace{1};

public:
    BilateralFilterNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class BilateralFilterComponent: public ocvflow::ProcessorComponent {
public:
    BilateralFilterComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The BoxFilterNode class
 */
class BoxFilterNode: public ocvflow::NodeItem {
    int ddepth{-1};
    cv::Size ksize{3,3};
    cv::Size anchor{-1,-1};
    bool normalize{true};
public:
    BoxFilterNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};

class BoxFilterComponent: public ocvflow::ProcessorComponent {
public:
    BoxFilterComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The SqrBoxFilterNode class
 */
class SqrBoxFilterNode: public ocvflow::NodeItem {
    int ddepth{1};
    cv::Size ksize{3,3};
    cv::Size anchor{-1,-1};
    bool normalize{true};
public:
    SqrBoxFilterNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class SqrBoxFilterComponent: public ocvflow::ProcessorComponent {
public:
    SqrBoxFilterComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The BlurNode class
 */
class BlurNode: public ocvflow::NodeItem {
    cv::Size ksize{3,3};
    cv::Size anchor{-1,-1};
public:
    BlurNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class BlurComponent: public ocvflow::ProcessorComponent {
public:
    BlurComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The ScharrNode class
 */
class ScharrNode: public ocvflow::NodeItem {
    int ddepth{-1};
    int dx{1};
    int dy{0};
    double scale{1};
    double delta{0};
public:
    ScharrNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class ScharrComponent: public ocvflow::ProcessorComponent {
public:
    ScharrComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The DilateNode class
 */
class DilateNode: public ocvflow::NodeItem {
    cv::Mat kernel;
    cv::Point anchor{cv::Point(-1,-1)};
    int iterations{1};
    int borderType{cv::BORDER_CONSTANT};
    cv::Scalar borderValue{cv::morphologyDefaultBorderValue()};
public:
    DilateNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class DilateComponent: public ocvflow::ProcessorComponent {
public:
    DilateComponent();
    ocvflow::Node* createNode() override;
};

/**
 * @brief The ErodeNode class
 */
class ErodeNode: public ocvflow::NodeItem {
    cv::Mat kernel;
    cv::Point anchor{cv::Point(-1,-1)};
    int iterations{1};
    int borderType{cv::BORDER_CONSTANT};
    cv::Scalar borderValue{cv::morphologyDefaultBorderValue()};
public:
    ErodeNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class ErodeComponent: public ocvflow::ProcessorComponent {
public:
    ErodeComponent();
    ocvflow::Node* createNode() override;
};


/**
 * @brief The CvtColorNode class
 */
class CvtColorNode: public ocvflow::NodeItem {
    int code{cv::COLOR_BGR2GRAY};
    int dstCn{0};
public:
    CvtColorNode();

    QMap<QString, ocvflow::Properties> properties() override;
    ocvflow::PropertiesVariant property(const QString &property) override;
    bool setProperty(const QString& property, const ocvflow::PropertiesVariant& value) override;

    void proccess() override;
};


class CvtColorComponent: public ocvflow::ProcessorComponent {
public:
    CvtColorComponent();
    ocvflow::Node* createNode() override;
};
#endif // OPCVF_IMGPROC_H
